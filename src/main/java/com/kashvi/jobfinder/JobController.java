
package com.kashvi.jobfinder;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get one job by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Job not found")));
    }

    // Search jobs by title
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    // Filter jobs by location
    @GetMapping("/location")
    public List<Job> filterByLocation(@RequestParam String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    // Filter jobs by type
    @GetMapping("/type")
    public List<Job> filterByType(@RequestParam String jobType) {
        return jobRepository.findByJobTypeIgnoreCase(jobType);
    }

    // Add a job posting
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        job.setId(null);
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }
}
