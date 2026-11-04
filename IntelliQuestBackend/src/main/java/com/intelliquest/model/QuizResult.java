package com.intelliquest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_result", indexes = {
    @Index(name = "idx_quizresult_user_marks", columnList = "user_id, marksAchieved")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private int totalMarks;
    private int marksAchieved;
    private int correctAnswers;
    private int wrongAnswers;
    private int totalQuestions;
    private int attemptedQuestions;

    private long submissionTime;
}
