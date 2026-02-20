package com.crms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.crms.entity.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
