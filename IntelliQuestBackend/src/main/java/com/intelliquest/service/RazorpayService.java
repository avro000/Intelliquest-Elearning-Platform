package com.intelliquest.service;

import com.intelliquest.dto.PaymentRequestDTO;
import com.intelliquest.model.Course;
import com.intelliquest.model.Enrollment;
import com.intelliquest.model.Payment;
import com.intelliquest.model.User;
import com.intelliquest.repository.CourseRepository;
import com.intelliquest.repository.EnrollmentRepository;
import com.intelliquest.repository.PaymentRepository;
import com.intelliquest.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private EnrollmentRepository enrollmentRepository;

	@Autowired
	private PaymentRepository paymentRepository;

    private final RazorpayClient razorpayClient;
    private final String keySecret;

    public RazorpayService(@Value("${razorpay.key_id}") String keyId,
                           @Value("${razorpay.key_secret}") String keySecret) throws Exception {
        this.keySecret = keySecret;
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
    }

    public String createOrder(Double amountInRupees) throws Exception {
        int amountInPaise = (int) Math.round(amountInRupees * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);
        return order.toString();
    }   

    public void recordPaymentAndEnrollUser(PaymentRequestDTO request) throws Exception {
        // Prevent replay attacks by checking if this payment gateway ID was already processed
        if (paymentRepository.existsByPaymentGatewayId(request.getRazorpayPaymentId())) {
            throw new IllegalArgumentException("This payment has already been processed and recorded.");
        }

        User user = userRepository.findByEmail(request.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Use the injected RazorpayClient (not hardcoded credentials)
        com.razorpay.Payment razorpayPayment = this.razorpayClient.payments.fetch(request.getRazorpayPaymentId());
        
        String method = razorpayPayment.get("method");
        String status = razorpayPayment.get("status");

        if (!"captured".equals(status)) {
            throw new IllegalStateException("Payment is not captured. Current status: " + status);
        }

        // Verify that paid amount matches or exceeds course price
        Integer amountInPaise = razorpayPayment.get("amount");
        int expectedAmountInPaise = (int) Math.round(course.getPrice().doubleValue() * 100);
        if (amountInPaise == null || amountInPaise < expectedAmountInPaise) {
            throw new SecurityException("Payment amount mismatch. Paid: " + amountInPaise + " paise, expected: " + expectedAmountInPaise + " paise.");
        }

        // Verify signature if provided by the client
        if (request.getRazorpaySignature() != null && !request.getRazorpaySignature().isBlank() && request.getRazorpayOrderId() != null) {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());
            boolean isValid = Utils.verifyPaymentSignature(options, this.keySecret);
            if (!isValid) {
                throw new SecurityException("Invalid Razorpay payment signature.");
            }
        }

        // Local Payment entity
        Payment payment = new Payment();
        payment.setPaymentGatewayId(request.getRazorpayPaymentId());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus(status);
        payment.setAmount(course.getPrice().doubleValue());

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setPayment(payment);

        enrollmentRepository.save(enrollment);
    }
}
