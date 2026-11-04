package com.intelliquest.controller;

import com.intelliquest.dto.CourseRequestDTO;
import com.intelliquest.dto.CourseResponseDTO;
import com.intelliquest.dto.PublishCourseRequestDTO;
import com.intelliquest.repository.CourseRepository;
import com.intelliquest.repository.StudyMaterialRepository;
import com.intelliquest.model.Course;
import com.intelliquest.model.StudyMaterial;
import com.intelliquest.model.User;
import com.intelliquest.model.User.UserRole;
import com.intelliquest.service.CourseService;
import com.intelliquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;
    private final CourseRepository courseRepository;
    private final StudyMaterialRepository studyMaterialRepository;

    @PostMapping("/create-courses")
    public ResponseEntity<?> createCourse(@ModelAttribute CourseRequestDTO dto,
                                          @AuthenticationPrincipal Object principal) {
        try {

            String email = null;

            if (principal instanceof OAuth2User) {
                OAuth2User oAuth2User = (OAuth2User) principal;
                email = oAuth2User.getAttribute("email");
            } else if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                email = userDetails.getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }

            if (email == null) {
                return ResponseEntity.status(401).body("Email is null after principal inspection.");
            }

            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("No user found with email = " + email);
            }

            User user = userOpt.get();
            System.out.println("DEBUG: Found user = " + user.getEmail() + ", Role = " + user.getRole());

            if (!user.getRole().equals(UserRole.INSTRUCTOR)) {
                return ResponseEntity.status(403).body("Forbidden: Only instructors can create courses.");
            }

            courseService.createCourse(dto, user);
            System.out.println("DEBUG: Course created successfully by user = " + email);
            return ResponseEntity.ok("Course created successfully.");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to process files: " + e.getMessage());
        } catch (MultipartException e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Invalid multipart data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Something went wrong: " + e.getMessage());
        }
    }
    
    @GetMapping("/instructor-courses")
    public ResponseEntity<?> getInstructorCourses(@AuthenticationPrincipal Object principal) {
        try {
            String email = null;

            if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            } else if (principal instanceof UserDetails userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof String emailString) {
                email = emailString;
            }

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email not found.");
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: User not found.");
            }

            User instructor = userOpt.get();

            if (!instructor.getRole().equals(UserRole.INSTRUCTOR)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden: Only instructors can access their courses.");
            }

            List<CourseResponseDTO> courses = courseService.getCoursesForInstructor(instructor);
            if (courses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("{\"error\": \"No courses available\"}");
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(courses);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Internal server error\"}");
        }
    }

    
    @PutMapping("/courses/{courseId}/edit")
    public ResponseEntity<String> editCourse(
            @PathVariable Long courseId,
            @ModelAttribute CourseRequestDTO courseRequestDTO,
            @AuthenticationPrincipal Object principal
    ) {
        try {
            String email = null;

            if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            } else if (principal instanceof UserDetails userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof org.springframework.security.core.userdetails.User user) {
                email = user.getUsername();
            } else if (principal instanceof String emailString) {
                email = emailString;
            }

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email not found.");
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: User not found.");
            }

            User user = userOpt.get();
            courseService.updateCourse(courseId, courseRequestDTO, user);
            return ResponseEntity.ok("Course updated successfully!");
        } catch (MultipartException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid multipart data: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process files: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update course: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/courses/{courseId}/delete")
    public ResponseEntity<String> deleteCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal Object principal
    ) {
        try {
            String email = null;

            if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            } else if (principal instanceof UserDetails userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof String emailString) {
                email = emailString;
            }

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email not found.");
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: User not found.");
            }

            User user = userOpt.get();

            if (!user.getRole().equals(UserRole.INSTRUCTOR)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden: Only instructors can delete courses.");
            }

            courseService.deleteCourse(courseId, user);

            return ResponseEntity.ok("Course deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete course: " + e.getMessage());
        }
    }
    
    @PatchMapping("/courses/{courseId}/publish")
    public ResponseEntity<?> updatePublishStatus(@PathVariable Long courseId,
                                                 @RequestBody PublishCourseRequestDTO request,
                                                 @AuthenticationPrincipal Object principal) {
        try {
            String email = null;

            if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            } else if (principal instanceof UserDetails userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof String emailStr) {
                email = emailStr;
            }

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Email not found.");
            }

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: User not found.");
            }

            User instructor = userOpt.get();

            if (!instructor.getRole().equals(UserRole.INSTRUCTOR)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden: Only instructors can publish courses.");
            }

            courseService.setCoursePublishedStatus(courseId, request.isPublished(), instructor);

            return ResponseEntity.ok("Course publish status updated successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
    
    @GetMapping("/courses/{id}/thumbnail")
    public ResponseEntity<?> getCourseThumbnail(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (course.getThumbnailUrl() != null && !course.getThumbnailUrl().isBlank()) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(course.getThumbnailUrl()))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
    

    
    @GetMapping("/courses/{courseId}/materials/{fileName}")
    public ResponseEntity<?> getStudyMaterial(
            @PathVariable Long courseId,
            @PathVariable String fileName,
            @RequestParam(defaultValue = "false") boolean download) {

        StudyMaterial material = studyMaterialRepository.findByCourse_CourseIdAndFileName(courseId, fileName);
        if (material == null || material.getFileUrl() == null || material.getFileUrl().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(material.getFileUrl()))
                .build();
    }

}
