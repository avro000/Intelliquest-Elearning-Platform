package com.intelliquest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.intelliquest.model.Payment;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByPaymentGatewayId(String paymentGatewayId);
    Optional<Payment> findByPaymentGatewayId(String paymentGatewayId);
}
