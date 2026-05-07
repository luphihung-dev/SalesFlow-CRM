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

    private static final BigDecimal MANAGER_APPROVAL_THRESHOLD = new BigDecimal("50000.00");

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
        Team enterpriseTeam = ensureTeam("Enterprise Sales", "Strategic accounts with larger contracts, approvals, and multi-stakeholder buying groups.");
        Team growthTeam = ensureTeam("Growth Sales", "SMB and mid-market customers with fast-cycle pilots, renewals, and expansion opportunities.");

        User admin = ensureUser(adminName, adminEmail, adminPassword, UserRole.ADMIN, null);
        User sales = ensureUser("Mia Tran", "sales@crm.local", "Sales12345", UserRole.SALES, growthTeam);
        User manager = ensureUser("Linh Nguyen", "manager@crm.local", "Manager12345", UserRole.MANAGER, growthTeam);
        User enterpriseRep = ensureUser("Ava Chen", "enterprise@crm.local", "Enterprise12345", UserRole.SALES, enterpriseTeam);

        if (customerRepository.count() > 0) {
            assignMissingCustomerTeams(growthTeam);
        }

        Customer saigonRetail = ensureCustomer("Cedar Retail Group", "procurement@saigonretail.test", "+84 901 234 567", CustomerCountry.VN, "Cedar Retail", CustomerStatus.ACTIVE, growthTeam);
        Customer lotusClinic = ensureCustomer("Lotus Care Clinics", "ops@lotuscare.test", "+84 987 654 321", CustomerCountry.VN, "Lotus Care", CustomerStatus.PROSPECT, growthTeam);
        Customer sakuraFoods = ensureCustomer("Sakura Foods Japan", "partnership@sakurafoods.test", "+81 90 1234 5678", CustomerCountry.JP, "Sakura Foods", CustomerStatus.ACTIVE, enterpriseTeam);
        Customer pacificLogistics = ensureCustomer("Pacific Logistics", "logistics@pacific.test", "+1 415 555 0198", CustomerCountry.US, "Pacific Logistics", CustomerStatus.ACTIVE, growthTeam);
        Customer mekongEdu = ensureCustomer("Mekong Learning Platform", "hello@mekongedu.test", "+84 912 345 678", CustomerCountry.VN, "Mekong Learning", CustomerStatus.INACTIVE, enterpriseTeam);
        Customer northstarSaas = ensureCustomer("Northstar SaaS", "revenue@northstar.test", "+1 212 555 0148", CustomerCountry.US, "Northstar SaaS", CustomerStatus.ACTIVE, growthTeam);
        Customer auroraHotels = ensureCustomer("Aurora Hotel Group", "guestops@aurorahotels.test", "+84 908 456 222", CustomerCountry.VN, "Aurora Hotels", CustomerStatus.PROSPECT, growthTeam);

        ensureDeal("Retail CRM onboarding", new BigDecimal("18500.00"), DealStage.QUALIFIED, saigonRetail, sales);
        ensureDeal("Healthcare follow-up workflow", new BigDecimal("7600.00"), DealStage.CONTACTED, lotusClinic, sales);
        ensureDeal("Japan distributor expansion", new BigDecimal("64000.00"), DealStage.NEW, sakuraFoods, enterpriseRep);
        ensureDeal("Logistics service renewal", new BigDecimal("28500.00"), DealStage.CLOSED, pacificLogistics, manager);
        ensureDeal("Education pilot package", new BigDecimal("4200.00"), DealStage.NEW, mekongEdu, enterpriseRep);
        ensureDeal("Customer success dashboard add-on", new BigDecimal("12800.00"), DealStage.QUALIFIED, northstarSaas, sales);
        ensureDeal("Hotel group service desk pilot", new BigDecimal("9800.00"), DealStage.CONTACTED, auroraHotels, sales);

        ensureTask("Confirm store rollout timeline with operations lead", LocalDate.now().plusDays(1), TaskStatus.TODO, sales, saigonRetail);
        ensureTask("Send clinic follow-up workflow proposal", LocalDate.now().plusDays(3), TaskStatus.TODO, sales, lotusClinic);
        ensureTask("Prepare manager approval brief for Japan expansion", LocalDate.now().plusDays(2), TaskStatus.TODO, manager, sakuraFoods);
        ensureTask("Send renewal summary email to logistics director", LocalDate.now().minusDays(1), TaskStatus.TODO, manager, pacificLogistics);
        ensureTask("Archive inactive education pilot notes", LocalDate.now().plusDays(5), TaskStatus.DONE, enterpriseRep, mekongEdu);
        ensureTask("Map customer health KPIs for SaaS expansion", LocalDate.now().plusDays(4), TaskStatus.TODO, sales, northstarSaas);
        ensureTask("Book discovery call with regional hotel managers", LocalDate.now().plusDays(2), TaskStatus.TODO, sales, auroraHotels);

        ensureActivity(ActivityType.CALL, "Discovery call completed with retail operations and finance. Buying team wants branch-level follow-up automation before rollout.", saigonRetail);
        ensureActivity(ActivityType.EMAIL, "Sent proposal summary, implementation checklist, and next-step questions for clinic patient follow-up workflows.", lotusClinic);
        ensureActivity(ActivityType.NOTE, "Enterprise expansion involves Japan regional distributors. Deal amount requires manager approval before final quote.", sakuraFoods);
        ensureActivity(ActivityType.NOTE, "Renewal closed after operations confirmed service continuity requirements for the next quarter.", pacificLogistics);
        ensureActivity(ActivityType.EMAIL, "Sent pilot wrap-up note and marked the education account inactive until next semester budget review.", mekongEdu);
        ensureActivity(ActivityType.CALL, "Customer success team requested dashboard add-on pricing tied to renewal risk and account health reporting.", northstarSaas);
        ensureActivity(ActivityType.NOTE, "Hotel group is evaluating a lightweight service desk workflow for guest operations across three properties.", auroraHotels);
    }

    private Team ensureTeam(String name, String description) {
        Team team = teamRepository.findByName(name).orElseGet(Team::new);
        team.setName(name);
        team.setDescription(description);
        return teamRepository.save(team);
    }

    private User ensureUser(String name, String email, String password, UserRole role, Team team) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setName(name);
        user.setEmail(email);
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }
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

    private Customer ensureCustomer(String name, String email, String phone, CustomerCountry country, String company, CustomerStatus status, Team team) {
        Customer customer = customerRepository.findByEmail(email).orElseGet(Customer::new);
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setCountry(country);
        customer.setCompany(company);
        customer.setStatus(status);
        customer.setTeam(team);
        return customerRepository.save(customer);
    }

    private void ensureDeal(String name, BigDecimal amount, DealStage stage, Customer customer, User owner) {
        Deal deal = dealRepository.findByNameAndCustomerId(name, customer.getId()).orElseGet(Deal::new);
        deal.setName(name);
        deal.setAmount(amount);
        deal.setStage(stage);
        deal.setRequiresManagerApproval(amount.compareTo(MANAGER_APPROVAL_THRESHOLD) > 0);
        deal.setCustomer(customer);
        deal.setOwner(owner);
        dealRepository.save(deal);
    }

    private void ensureTask(String title, LocalDate dueDate, TaskStatus status, User user, Customer customer) {
        Task task = taskRepository.findByTitleAndCustomerId(title, customer.getId()).orElseGet(Task::new);
        task.setTitle(title);
        task.setDueDate(dueDate);
        task.setStatus(status);
        task.setUser(user);
        task.setCustomer(customer);
        taskRepository.save(task);
    }

    private void ensureActivity(ActivityType type, String description, Customer customer) {
        Activity activity = activityRepository.findByDescriptionAndCustomerId(description, customer.getId()).orElseGet(Activity::new);
        activity.setType(type);
        activity.setDescription(description);
        activity.setCustomer(customer);
        activityRepository.save(activity);
    }
}
