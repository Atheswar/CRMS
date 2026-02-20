package com.crms.service;
import com.crms.entity.ResourceStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.crms.repository.ResourceRepository;
import com.crms.entity.Resource;
import com.crms.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    // 1️⃣ Create Resource
    public Resource createResource(Resource resource) {
        resource.setStatus(ResourceStatus.AVAILABLE);
        return resourceRepository.save(resource);
    }

    // 2️⃣ Get All Resources
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // 3️⃣ Update Resource
    public Resource updateResource(Long id, Resource updatedResource) {

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        existing.setName(updatedResource.getName());
        existing.setType(updatedResource.getType());
        existing.setCapacity(updatedResource.getCapacity());
        existing.setStatus(updatedResource.getStatus());

        return resourceRepository.save(existing);
    }

    // 4️⃣ Delete Resource
    public void deleteResource(Long id) {

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        resourceRepository.delete(existing);
    }
}
