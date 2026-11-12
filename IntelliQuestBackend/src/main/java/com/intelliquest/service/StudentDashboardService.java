package com.intelliquest.service;

import com.intelliquest.dto.CourseResponseDTO;
import com.intelliquest.model.*;
import com.intelliquest.repository.CourseRepository;
import com.intelliquest.repository.EnrollmentRepository;
import com.intelliquest.repository.LessonProgressRepository;
import com.intelliquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final UserRepository userRepository;


    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCoursesForStudents() {
    	List<Course> courses = courseRepository.findByPublishedTrue();
        return courses.stream()
                .map(this::convertToCourseResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getEnrolledCoursesForStudent(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        return enrollments.stream()
                .map(enrollment -> convertToCourseResponseDTO(enrollment.getCourse()))
                .collect(Collectors.toList());
    }

    private CourseResponseDTO convertToCourseResponseDTO(Course course) {
        if (course == null) return null;
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setCategory(course.getCategory());
        dto.setLevel(course.getLevel());
        dto.setLanguage(course.getLanguage());
        dto.setPublished(course.isPublished());

        try {
            if (course.getInstructor() != null) {
                dto.setInstructorEmail(course.getInstructor().getEmail());
            }
        } catch (Exception ignored) {}

        String thumb = course.getThumbnailUrl();
        if (thumb == null || thumb.isBlank()) {
            thumb = "/auth/courses/" + course.getCourseId() + "/thumbnail";
        }
        dto.setThumbnailUrl(thumb);

        List<CourseResponseDTO.TopicDTO> topicDTOs = new java.util.ArrayList<>();
        try {
            if (course.getTopics() != null) {
                for (Topic topic : course.getTopics()) {
                    CourseResponseDTO.TopicDTO topicDTO = new CourseResponseDTO.TopicDTO();
                    topicDTO.setName(topic.getName());
                    List<CourseResponseDTO.SubtopicDTO> subtopicDTOs = new java.util.ArrayList<>();
                    if (topic.getSubtopics() != null) {
                        for (Subtopic subtopic : topic.getSubtopics()) {
                            CourseResponseDTO.SubtopicDTO subtopicDTO = new CourseResponseDTO.SubtopicDTO();
                            subtopicDTO.setName(subtopic.getName());
                            List<CourseResponseDTO.VideoDTO> videoDTOs = new java.util.ArrayList<>();
                            if (subtopic.getVideos() != null) {
                                for (Video video : subtopic.getVideos()) {
                                    CourseResponseDTO.VideoDTO videoDTO = new CourseResponseDTO.VideoDTO();
                                    videoDTO.setTitle(video.getTitle());
                                    videoDTO.setDescription(video.getDescription());
                                    videoDTO.setUrl(video.getUrl());
                                    videoDTOs.add(videoDTO);
                                }
                            }
                            subtopicDTO.setVideos(videoDTOs);
                            subtopicDTOs.add(subtopicDTO);
                        }
                    }
                    topicDTO.setSubtopics(subtopicDTOs);
                    topicDTOs.add(topicDTO);
                }
            }
        } catch (Exception ignored) {}
        dto.setTopics(topicDTOs);

        try {
            CourseOptions options = course.getCourseOptions();
            if (options != null) {
                CourseResponseDTO.CourseOptionDTO optionDTO = new CourseResponseDTO.CourseOptionDTO();
                optionDTO.setBenefits(options.getBenefits());
                optionDTO.setPrerequisites(options.getPrerequisites());
                dto.setCourseOptions(optionDTO);
            }
        } catch (Exception ignored) {}

        String baseUrl = "/auth/courses/" + course.getCourseId() + "/materials/";
        List<CourseResponseDTO.StudyMaterialDTO> studyMaterials = new java.util.ArrayList<>();
        try {
            if (course.getStudyMaterials() != null) {
                for (StudyMaterial material : course.getStudyMaterials()) {
                    CourseResponseDTO.StudyMaterialDTO materialDTO = new CourseResponseDTO.StudyMaterialDTO();
                    materialDTO.setName(material.getName());
                    materialDTO.setFileName(material.getFileName());
                    materialDTO.setFileUrl(material.getFileUrl() != null ? material.getFileUrl() : baseUrl + material.getFileName() + "?download=false");
                    materialDTO.setDownloadUrl(material.getFileUrl() != null ? material.getFileUrl() : baseUrl + material.getFileName() + "?download=true");
                    studyMaterials.add(materialDTO);
                }
            }
        } catch (Exception ignored) {}
        dto.setStudyMaterials(studyMaterials);

        return dto;
    }
    
    @Transactional(readOnly = true)
    public Optional<CourseResponseDTO> getCourseDetailsById(Long courseId) {
        return courseRepository.findById(courseId)
                .filter(Course::isPublished)
                .map(this::convertToCourseResponseDTO);
    }
    
    @Transactional
    public void markLessonAsComplete(Long userId, Long courseId, String lessonId) {
        Optional<LessonProgress> progressOpt = lessonProgressRepository.findByUserIdAndCourseCourseIdAndLessonId(userId, courseId, lessonId);
        if (progressOpt.isEmpty()) {
            LessonProgress progress = new LessonProgress();
            progress.setUser(userRepository.getReferenceById(userId));
            progress.setCourse(courseRepository.getReferenceById(courseId));
            progress.setLessonId(lessonId);
            progress.setCompleted(true);
            lessonProgressRepository.save(progress);
        }
    }
    
    @Transactional(readOnly = true)
    public List<String> getCompletedLessonIds(Long userId, Long courseId) {
        return lessonProgressRepository.findByUserIdAndCourseCourseId(userId, courseId).stream()
                .filter(LessonProgress::isCompleted)
                .map(LessonProgress::getLessonId)
                .collect(Collectors.toList());
    }


}
