
package com.kashvi.jobfinder;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matching")
public class SkillMatchController {

    private final JobRepository jobRepository;

    public SkillMatchController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Map<String, Object>> matchJobs(
            @RequestParam String skills) {

        Set<String> studentSkills = Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        return jobRepository.findAll().stream()
                .map(job -> {
                    List<String> required = Arrays.stream(
                            job.getRequiredSkills().split(","))
                            .map(String::trim)
                            .filter(s -> !s.isBlank())
                            .toList();

                    List<String> matched = required.stream()
                            .filter(s -> studentSkills.contains(
                                    s.toLowerCase()))
                            .toList();

                    List<String> missing = required.stream()
                            .filter(s -> !studentSkills.contains(
                                    s.toLowerCase()))
                            .toList();

                    double score = required.isEmpty() ? 0 :
                            matched.size() * 100.0 / required.size();

                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("jobId", job.getId());
                    result.put("title", job.getTitle());
                    result.put("company", job.getCompany());
                    result.put("matchPercentage",
                            Math.round(score * 100.0) / 100.0);
                    result.put("matchedSkills", matched);
                    result.put("missingSkills", missing);

                    return result;
                })
                .sorted((a, b) -> Double.compare(
                        ((Number) b.get("matchPercentage")).doubleValue(),
                        ((Number) a.get("matchPercentage")).doubleValue()))
                .toList();
    }
}
