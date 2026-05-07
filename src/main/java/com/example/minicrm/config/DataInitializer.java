package com.example.minicrm.config;

import com.example.minicrm.entity.Activity;
import com.example.minicrm.entity.ActivityType;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.entity.CustomerCountry;
import com.example.minicrm.entity.CustomerStatus;
import com.example.minicrm.entity.Deal;
import com.example.minicrm.entity.DealStage;
import com.example.minicrm.entity.Task;
import com.example.minicrm.entity.TaskStatus;
import com.example.minicrm.entity.Team;
import com.example.minicrm.entity.User;
import com.example.minicrm.entity.UserRole;
import com.example.minicrm.repository.ActivityRepository;
import com.example.minicrm.repository.CustomerRepository;
import com.example.minicrm.repository.DealRepository;
import com.example.minicrm.repository.TaskRepository;
import com.example.minicrm.repository.TeamRepository;
import com.example.minicrm.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminName;
    private final String adminEmail;
    private final String adminPassword;

    public DataInitializer(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            DealRepository dealRepository,
            TaskRepository taskRepository,
            ActivityRepository activityRepository,
            TeamRepository teamRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.name}") String adminName,
            @Value("${app.bootstrap-admin.email}") String adminEmail,
            @Value("${app.bootstrap-admin.password}") String adminPassword
    ) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.activityRepository = activityRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        Team enterpriseTeam = teamRepository.findByName("Enterprise Sales")
                .orElseGet(() -> createTeam("Enterprise Sales", "Handles larger accounts, approvals, and multi-stakeholder opportunities."));
        Team growthTeam = teamRepository.findByName("Growth Sales")
                .orElseGet(() -> createTeam("Growth Sales", "Handles SMB customers, pilots, and fast-cycle opportunities."));

        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> createUser(adminName, adminEmail, adminPassword, UserRole.ADMIN, null));
        User sales = userRepository.findByEmail("sales@crm.local").orElseGet(() -> createUser("Mia Sales", "sales@crm.local", "Sales12345", UserRole.SALES, growthTeam));
        User manager = userRepository.findByEmail("manager@crm.local").orElseGet(() -> createUser("Linh Manager", "manager@crm.local", "Manager12345", UserRole.MANAGER, growthTeam));
        assignTeamIfMissing(sales, growthTeam);
        assignTeamIfMissing(manager, growthTeam);

        if (customerRepository.count() > 0) {
            assignMissingCustomerTeams(growthTeam);
            return;
        }

        Customer saigonRetail = createCustomer("Saigon Retail Group", "procurement@saigonretail.test", "+84 901 234 567", CustomerCountry.VN, "Saigon Retail", CustomerStatus.ACTIVE, growthTeam);
        Customer lotusClinic = createCustomer("Lotus Care Clinic", "ops@lotuscare.test", "+84 987 654 321", CustomerCountry.VN, "Lotus Care", CustomerStatus.PROSPECT, growthTeam);
        Customer sakuraFoods = createCustomer("Sakura Foods Japan", "partnership@sakurafoods.test", "+81 90 1234 5678", CustomerCountry.JP, "Sakura Foods", CustomerStatus.ACTIVE, growthTeam);
        Customer pacificLogistics = createCustomer("Pacific Logistics", "logistics@pacific.test", "+1 415 555 0198", CustomerCountry.US, "Pacific Logistics", CustomerStatus.ACTIVE, growthTeam);
        Customer mekongEdu = createCustomer("Mekong Edu Platform", "hello@mekongedu.test", "+84 912 345 678", CustomerCountry.VN, "Mekong Edu", CustomerStatus.INACTIVE, enterpriseTeam);

        createDeal("Retail CRM onboarding", new BigDecimal("18500.00"), DealStage.QUALIFIED, saigonRetail, sales);
        createDeal("Healthcare follow-up workflow", new BigDecimal("7600.00"), DealStage.CONTACTED, lotusClinic, sales);
        createDeal("Japan expansion support", new BigDecimal("64000.00"), DealStage.NEW, sakuraFoods, manager);
        createDeal("Logistics service renewal", new BigDecimal("28500.00"), DealStage.CLOSED, pacificLogistics, manager);
        createDeal("Education pilot package", new BigDecimal("4200.00"), DealStage.NEW, mekongEdu, admin);

        createTask("Call buyer team about rollout timeline", LocalDate.now().plusDays(1), TaskStatus.TODO, sales, saigonRetail);
        createTask("Prepare healthcare workflow proposal", LocalDate.now().plusDays(3), TaskStatus.TODO, sales, lotusClinic);
        createTask("Review enterprise approval package", LocalDate.now().plusDays(2), TaskStatus.TODO, manager, sakuraFoods);
        createTask("Send renewal summary email", LocalDate.now().minusDays(1), TaskStatus.TODO, sales, pacificLogistics);
        createTask("Archive inactive education pilot notes", LocalDate.now().plusDays(5), TaskStatus.DONE, admin, mekongEdu);

        createActivity(ActivityType.CALL, "Discovery call completed with buying committee. Team is evaluating CRM automation for branch managers.", saigonRetail);
        createActivity(ActivityType.EMAIL, "Sent proposal summary and implementation checklist for healthcare follow-up workflows.", lotusClinic);
        createActivity(ActivityType.NOTE, "Enterprise opportunity identified. Manager approval is required before final quote.", sakuraFoods);
        createActivity(ActivityType.NOTE, "Renewal closed after operations team confirmed service continuity requirements.", pacificLogistics);
        createActivity(ActivityType.EMAIL, "Sent pilot wrap-up note and marked account inactive until next semester budget review.", mekongEdu);
    }

    private Team createTeam(String name, String description) {
        Team team = new Team();
        team.setName(name);
        team.setDescription(description);
        return teamRepository.save(team);
    }

    private User createUser(String name, String email, String password, UserRole role, Team team) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setTeam(team);
        return userRepository.save(user);
    }

    private void assignTeamIfMissing(User user, Team team) {
        if (user.getTeam() == null) {
            user.setTeam(team);
            userRepository.save(user);
        }
    }

    private void assignMissingCustomerTeams(Team defaultTeam) {
        customerRepository.findAll().stream()
                .filter((customer) -> customer.getTeam() == null)
                .forEach((customer) -> {
                    customer.setTeam(defaultTeam);
                    customerRepository.save(customer);
                });
    }

    private Customer createCustomer(String name, String email, String phone, CustomerCountry country, String company, CustomerStatus status, Team team) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setCountry(country);
        customer.setCompany(company);
        customer.setStatus(status);
        customer.setTeam(team);
        return customerRepository.save(customer);
    }

    private void createDeal(String name, BigDecimal amount, DealStage stage, Customer customer, User owner) {
        Deal deal = new Deal();
        deal.setName(name);
        deal.setAmount(amount);
        deal.setStage(stage);
        deal.setCustomer(customer);
        deal.setOwner(owner);
        dealRepository.save(deal);
    }

    private void createTask(String title, LocalDate dueDate, TaskStatus status, User user, Customer customer) {
        Task task = new Task();
        task.setTitle(title);
        task.setDueDate(dueDate);
        task.setStatus(status);
        task.setUser(user);
        task.setCustomer(customer);
        taskRepository.save(task);
    }

    private void createActivity(ActivityType type, String description, Customer customer) {
        Activity activity = new Activity();
        activity.setType(type);
        activity.setDescription(description);
        activity.setCustomer(customer);
        activityRepository.save(activity);
    }
}
