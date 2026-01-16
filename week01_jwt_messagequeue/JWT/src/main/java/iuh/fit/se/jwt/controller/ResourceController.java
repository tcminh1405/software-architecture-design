package iuh.fit.se.jwt.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Resource Controller
 * Các endpoint được bảo vệ bởi OAuth2 Resource Server
 * Yêu cầu Access Token hợp lệ để truy cập
 */
@Slf4j
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    /**
     * Public endpoint - không cần authentication
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicResource() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a public resource");
        response.put("accessible", "Everyone can access this");
        return ResponseEntity.ok(response);
    }

    /**
     * Protected endpoint - yêu cầu authentication
     * Bất kỳ user nào đã đăng nhập đều có thể truy cập
     */
    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedResource() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a protected resource");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("authenticated", authentication.isAuthenticated());
        
        log.info("Protected resource accessed by: {}", authentication.getName());
        return ResponseEntity.ok(response);
    }

    /**
     * Admin endpoint - chỉ ADMIN mới có thể truy cập
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminResource() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is an admin-only resource");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        
        log.info("Admin resource accessed by: {}", authentication.getName());
        return ResponseEntity.ok(response);
    }

    /**
     * User endpoint - chỉ USER role mới có thể truy cập
     */
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> userResource() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a user-only resource");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        
        log.info("User resource accessed by: {}", authentication.getName());
        return ResponseEntity.ok(response);
    }
}

