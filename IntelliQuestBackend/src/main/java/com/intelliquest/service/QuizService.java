package com.intelliquest.service;

import com.intelliquest.dto.QuizResultDTO;
import com.intelliquest.dto.QuizStatsDTO;
import com.intelliquest.dto.QuizSubmissionDTO;
import com.intelliquest.model.Option;
import com.intelliquest.model.Question;
import com.intelliquest.model.Quiz;
import com.intelliquest.model.QuizResult;
import com.intelliquest.model.User;
import com.intelliquest.repository.QuizRepository;
import com.intelliquest.repository.QuizResultRepository;
import com.intelliquest.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizResultRepository quizResultRepository;
    private final R2StorageService r2StorageService;

    @Transactional
    public Quiz createQuiz(QuizSubmissionDTO quizDTO, User user, MultipartFile thumbnailFile) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isEmpty() || existingUser.get().getRole() != User.UserRole.INSTRUCTOR) {
            throw new RuntimeException("User does not have the instructor role to create a quiz.");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setPlayingTime(quizDTO.getPlayingTime());
        quiz.setLevel(quizDTO.getLevel());
        quiz.setCategory(quizDTO.getCategory());
        quiz.setInstructor(user);
        
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            try {
                String r2Url = r2StorageService.uploadFile(thumbnailFile, "quizzes/thumbnails");
                quiz.setThumbnailUrl(r2Url);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload quiz thumbnail to R2", e);
            }
        }

        List<Question> questionEntities = new ArrayList<>();

        for (QuizSubmissionDTO.Question questionDTO : quizDTO.getQuestions()) {
            Question question = new Question();
            question.setId(questionDTO.getId());
            question.setQuestion(questionDTO.getQuestion());
            question.setCorrectOptionId(questionDTO.getCorrectOptionId());
            question.setMarksForCorrect(questionDTO.getMarksForCorrect());
            question.setMarksForIncorrect(questionDTO.getMarksForIncorrect());
            question.setQuiz(quiz);

            List<Option> optionEntities = new ArrayList<>();
            for (QuizSubmissionDTO.Option optionDTO : questionDTO.getOptions()) {
                Option option = new Option();
                option.setId(optionDTO.getId());
                option.setText(optionDTO.getText());
                option.setQuestion(question);
                optionEntities.add(option);
            }

            question.setOptions(optionEntities);
            questionEntities.add(question);
        }

        quiz.setQuestions(questionEntities);

        return quizRepository.save(quiz);
    }
    
    @Transactional
    public Quiz getQuiz(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    
    @Transactional
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    @Transactional
    public List<Quiz> getQuizzesByInstructor(User instructor) {
        return quizRepository.findByInstructor(instructor);
    }

    @Transactional
    public void deleteQuiz(Long quizId, User currentUser) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        if (!quiz.getInstructor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to delete this quiz.");
        }

        if (quiz.getThumbnailUrl() != null && !quiz.getThumbnailUrl().isBlank()) {
            r2StorageService.deleteFile(quiz.getThumbnailUrl());
        }

        quizRepository.delete(quiz);
    }
    
    public long getTotalQuizzesByInstructor(Long instructorId) {
        return quizRepository.countByInstructorId(instructorId);
    }
    
    public QuizResultDTO saveResult(QuizResultDTO dto, String authenticatedEmail) {
        Quiz quiz = quizRepository.findById(dto.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        String userEmail = authenticatedEmail != null ? authenticatedEmail : dto.getSub();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        int totalQuestions = quiz.getQuestions().size();
        int totalMarks = quiz.getQuestions().stream().mapToInt(q -> q.getMarksForCorrect() > 0 ? q.getMarksForCorrect() : 1).sum();
        int attemptedQuestions = 0;
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int marksAchieved = 0;

        // Authoritative server-side grading
        if (dto.getSelectedAnswers() != null && !dto.getSelectedAnswers().isEmpty()) {
            for (var question : quiz.getQuestions()) {
                String questionKey = String.valueOf(question.getId());
                String selectedOption = dto.getSelectedAnswers().get(questionKey);
                if (selectedOption != null) {
                    attemptedQuestions++;
                    if (selectedOption.equals(question.getCorrectOptionId())) {
                        correctAnswers++;
                        marksAchieved += (question.getMarksForCorrect() > 0 ? question.getMarksForCorrect() : 1);
                    } else {
                        wrongAnswers++;
                        marksAchieved += question.getMarksForIncorrect();
                    }
                }
            }
        } else {
            // Fallback bounded check to prevent client tampering
            totalMarks = dto.getTotalMarks() > 0 ? dto.getTotalMarks() : totalMarks;
            marksAchieved = Math.min(dto.getMarksAchieved(), totalMarks);
            correctAnswers = Math.min(dto.getCorrectAnswers(), totalQuestions);
            wrongAnswers = Math.min(dto.getWrongAnswers(), totalQuestions);
            attemptedQuestions = Math.min(dto.getAttemptedQuestions(), totalQuestions);
        }

        QuizResult result = QuizResult.builder()
                .quiz(quiz)
                .user(user)
                .totalMarks(totalMarks)
                .marksAchieved(marksAchieved)
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .totalQuestions(totalQuestions)
                .attemptedQuestions(attemptedQuestions)
                .submissionTime(System.currentTimeMillis())
                .build();

        quizResultRepository.save(result);

        return QuizResultDTO.builder()
                .quizId(quiz.getId())
                .sub(user.getEmail())
                .totalMarks(totalMarks)
                .marksAchieved(marksAchieved)
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .totalQuestions(totalQuestions)
                .attemptedQuestions(attemptedQuestions)
                .quizTitle(quiz.getTitle())
                .category(quiz.getCategory())
                .submissionTime(result.getSubmissionTime())
                .build();
    }
    
    public long getUniqueParticipantCountOrThrow(Long quizId) {
        quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Quiz ID: " + quizId));

        return quizResultRepository.countDistinctByQuizId(quizId);
    }
    
    public long getTotalMarksForUserByEmail(String email) {
        Long total = quizResultRepository.getTotalMarksByEmail(email);
        return total != null ? total : 0L;
    }
    
    @Transactional
    public List<QuizResultDTO> getQuizResultsForUser(Long userId) {
        List<QuizResult> results = quizResultRepository.findByUserId(userId);

        return results.stream().map(r -> QuizResultDTO.builder()
            .quizId(r.getQuiz().getId())
            .sub(r.getUser().getEmail())
            .totalMarks(r.getTotalMarks())
            .marksAchieved(r.getMarksAchieved())
            .correctAnswers(r.getCorrectAnswers())
            .wrongAnswers(r.getWrongAnswers())
            .totalQuestions(r.getTotalQuestions())
            .attemptedQuestions(r.getAttemptedQuestions())
            .quizTitle(r.getQuiz().getTitle())         
            .category(r.getQuiz().getCategory())       
            .submissionTime(r.getSubmissionTime())     
            .build()
        ).toList();
    }
    
    public QuizStatsDTO getStatsForUser(String email) {
        long completed = quizResultRepository.countQuizzesCompleted(email);
        Double avgRaw = quizResultRepository.calculateAverageScore(email);
        Integer highest = quizResultRepository.findHighestScore(email);
        String category = quizResultRepository.findMostPlayedCategory(email);

        return QuizStatsDTO.builder()
                .quizzesCompleted(completed)
                .averageScore(avgRaw != null ? Math.round(avgRaw * 10000.0) / 100.0 : 0.0)
                .highestScore(highest != null ? highest : 0)
                .bestCategory(category != null ? category : "N/A")
                .build();
    }
    
    public List<Map<String, Object>> getLeaderboardData() {
        List<Object[]> results = quizResultRepository.findUsersWithTotalPoints(org.springframework.data.domain.PageRequest.of(0, 100));

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("email", row[0]);
            map.put("points", row[1]);
            map.put("username", row[2]);
            leaderboard.add(map);
        }

        return leaderboard;
    }

}
