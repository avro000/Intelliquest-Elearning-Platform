package com.intelliquest.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> verifiedEmails = new ConcurrentHashMap<>();

    public String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    @Async("taskExecutor")
    public void sendOtpEmail(String toEmail, String otp) {
        try {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Your IntelliQuest OTP Code");

        String htmlContent = """
        	    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9f9f9;">
        	        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

        	            <!-- Branding: image + text side by side -->
        	            <table cellpadding="0" cellspacing="0" style="width: 100%%; margin-bottom: 20px;">
        	                <tr>
        	                    <td style="width: 50px; vertical-align: middle;">
        	                        <img src="https://github.com/avro000/minorproject_caloriecraft/blob/main/Untitled%%20design%%20(1).png?raw=true" alt="IntelliQuest Logo" width="30" height="30" style="display: block;" />
        	                    </td>
        	                    <td style="vertical-align: middle;">
        	                        <h2 style="margin: 0; font-size: 20px; color: #000000;">IntelliQuest.</h2>
        	                    </td>
        	                </tr>
        	            </table>

        	            <p style="font-size: 16px; color: #333;">Hello,</p>
        	            <p style="font-size: 16px; color: #333;">
        	                Your One-Time Password (OTP) for resetting your password is:
        	            </p>
        	            <p style="font-size: 24px; font-weight: bold; color: #2e6bc7; text-align: center; letter-spacing: 2px;">%s</p>
        	            <p style="font-size: 14px; color: #555;">This OTP is valid for 5 minutes. Please do not share this code with anyone.</p>
        	            <hr style="margin: 30px 0;">
        	            <p style="font-size: 12px; color: #999;">If you did not request this OTP, you can safely ignore this email.</p>
        	            <p style="font-size: 12px; color: #999;">&copy; IntelliQuest &bull; All rights reserved.</p>
        	        </div>
        	    </div>
        	""".formatted(otp);


        helper.setText(htmlContent, true);
        helper.setFrom("work.intelliquest@gmail.com");

        mailSender.send(message);
        System.out.println("OTP email sent successfully to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void storeOtp(String email, String otp) {
        otpStorage.put(email, new OtpData(otp, LocalDateTime.now()));
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) return false;

        LocalDateTime now = LocalDateTime.now();
        // 5 minute validity
        if (now.isAfter(otpData.generatedTime.plusMinutes(5))) {
            otpStorage.remove(email);
            return false;
        }

        // Increment attempt count (max 5 attempts allowed)
        otpData.attempts++;
        if (otpData.attempts > 5) {
            otpStorage.remove(email);
            return false;
        }

        if (otpData.otp.equals(otp)) {
            otpStorage.remove(email);
            verifiedEmails.put(email, LocalDateTime.now());
            return true;
        }

        return false;
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }

    public boolean isEmailVerified(String email) {
        LocalDateTime verifiedTime = verifiedEmails.get(email);
        if (verifiedTime == null) return false;
        // Verification valid for 10 minutes to reset password
        if (LocalDateTime.now().isAfter(verifiedTime.plusMinutes(10))) {
            verifiedEmails.remove(email);
            return false;
        }
        return true;
    }

    public void clearVerification(String email) {
        verifiedEmails.remove(email);
    }

    private static class OtpData {
        String otp;
        LocalDateTime generatedTime;
        int attempts;

        OtpData(String otp, LocalDateTime generatedTime) {
            this.otp = otp;
            this.generatedTime = generatedTime;
            this.attempts = 0;
        }
    }
}
