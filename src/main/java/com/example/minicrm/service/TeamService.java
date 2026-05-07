package com.example.minicrm.service;

import com.example.minicrm.dto.TeamResponse;
import com.example.minicrm.entity.Team;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.TeamRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> findAll() {
        return teamRepository.findAll().stream().map(this::toResponse).toList();
    }

    public Team getTeam(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
    }

    private TeamResponse toResponse(Team team) {
        return new TeamResponse(team.getId(), team.getName(), team.getDescription());
    }
}
