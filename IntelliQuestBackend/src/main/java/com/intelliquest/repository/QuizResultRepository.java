package com.intelliquest.repository;

import com.intelliquest.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;


public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    @Query("SELECT r FROM QuizResult r JOIN FETCH r.quiz JOIN FETCH r.user WHERE r.user.email = :email")
    List<QuizResult> findByUserEmail(@Param("email") String email);
    
    @Query("SELECT r FROM QuizResult r JOIN FETCH r.quiz JOIN FETCH r.user WHERE r.user.id = :userId")
    List<QuizResult> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT r.user.id) FROM QuizResult r WHERE r.quiz.id = :quizId")
    long countDistinctByQuizId(@Param("quizId") Long quizId);
    
    @Query("SELECT SUM(qr.marksAchieved) FROM QuizResult qr WHERE qr.user.email = :email")
    Long getTotalMarksByEmail(@Param("email") String email);
    
    @Query("SELECT COUNT(r) FROM QuizResult r WHERE r.user.email = :email")
    long countQuizzesCompleted(@Param("email") String email);

    @Query("SELECT AVG(r.marksAchieved * 1.0 / r.totalMarks) FROM QuizResult r WHERE r.user.email = :email AND r.totalMarks > 0")
    Double calculateAverageScore(@Param("email") String email);

    @Query("SELECT MAX(r.marksAchieved) FROM QuizResult r WHERE r.user.email = :email")
    Integer findHighestScore(@Param("email") String email);

    @Query("SELECT r.quiz.category FROM QuizResult r WHERE r.user.email = :email GROUP BY r.quiz.category ORDER BY COUNT(r) DESC LIMIT 1")
    String findMostPlayedCategory(@Param("email") String email);
    
    @Query("""
    	    SELECT qr.user.email, SUM(qr.marksAchieved), qr.user.username
    	    FROM QuizResult qr
    	    GROUP BY qr.user.email, qr.user.username
    	    ORDER BY SUM(qr.marksAchieved) DESC
    	""")
    List<Object[]> findUsersWithTotalPoints(Pageable pageable);
    	
}
