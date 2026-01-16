package iuh.fit.se.jwt.service;

import iuh.fit.se.jwt.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * User Service
 * Quản lý thông tin user và authentication
 * Trong thực tế, service này sẽ kết nối với database
 */
@Slf4j
@Service
public class UserService implements UserDetailsService {

    // Mock database - trong thực tế sẽ kết nối với database
    private final Map<String, User> users = new HashMap<>();

    public UserService() {
        // Khởi tạo một số user mẫu
        users.put("admin", User.builder()
                .id(1L)
                .username("admin")
                .password("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK5D0yW2") // password: admin123
                .roles(Arrays.asList("ADMIN", "USER"))
                .build());
        
        users.put("user", User.builder()
                .id(2L)
                .username("user")
                .password("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK5D0yW2") // password: admin123
                .roles(Arrays.asList("USER"))
                .build());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = users.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }

    /**
     * Tìm user theo username
     */
    public User findByUsername(String username) {
        return users.get(username);
    }

    /**
     * Validate password
     * Trong thực tế sẽ sử dụng BCryptPasswordEncoder để hash và verify password
     */
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        // Đơn giản hóa: trong thực tế sử dụng BCryptPasswordEncoder
        // Ở đây chỉ để demo, password mặc định là "admin123"
        return "admin123".equals(rawPassword);
    }
}

