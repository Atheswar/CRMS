package com.crms.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.crms.service.ResourceService;
import com.crms.entity.Resource;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin
public class ResourceController {

    private final ResourceService resourceService;

    // 1️⃣ Create Resource
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // 2️⃣ Get All Resources
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    // 3️⃣ Update Resource
    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable Long id,
                                   @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    // 4️⃣ Delete Resource
    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return "Resource deleted successfully";
    }
}
