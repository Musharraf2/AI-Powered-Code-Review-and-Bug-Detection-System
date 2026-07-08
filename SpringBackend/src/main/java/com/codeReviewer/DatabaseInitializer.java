package com.codeReviewer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        System.out.println("Verifying and migrating database column schemas...");
        
        // Migrate 'code' column
        try {
            jdbcTemplate.execute("ALTER TABLE test_entity ALTER COLUMN code TYPE TEXT");
            System.out.println("Migrated column 'code' to TEXT");
        } catch (Exception e) {
            System.out.println("Column 'code' migration note: " + e.getMessage());
        }

        // Migrate 'processed_text' column
        try {
            jdbcTemplate.execute("ALTER TABLE test_entity ALTER COLUMN processed_text TYPE TEXT");
            System.out.println("Migrated column 'processed_text' to TEXT");
        } catch (Exception e) {
            System.out.println("Column 'processed_text' migration note: " + e.getMessage());
        }

        // Migrate 'analysis_result' column
        try {
            jdbcTemplate.execute("ALTER TABLE test_entity ALTER COLUMN analysis_result TYPE TEXT");
            System.out.println("Migrated column 'analysis_result' to TEXT");
        } catch (Exception e) {
            System.out.println("Column 'analysis_result' migration note: " + e.getMessage());
        }

        // Migrate 'additional_information' column
        try {
            jdbcTemplate.execute("ALTER TABLE test_entity ALTER COLUMN additional_information TYPE TEXT");
            System.out.println("Migrated column 'additional_information' to TEXT");
        } catch (Exception e) {
            System.out.println("Column 'additional_information' migration note: " + e.getMessage());
        }
    }
}
