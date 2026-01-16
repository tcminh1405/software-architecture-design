package iuh.fit.se.jwt.controller;

import iuh.fit.se.jwt.dto.AuthRequest;
import iuh.fit.se.jwt.dto.AuthResponse;
import iuh.fit.se.jwt.dto.RefreshTokenRequest;
import iuh.fit.se.jwt.model.User;
import iuh.fit.se.jwt.service.UserService;
import iuh.fit.se.jwt.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Xử lý các request liên quan đến authentication:
 * - POST /api/auth/login: Đăng nhập và nhận Access Token + Refresh Token
 * - POST /api/auth/refresh: Lấy Access Token mới từ Refresh Token
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Endpoint đăng nhập
     * Nhận username và password, trả về Access Token và Refresh Token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Tìm user theo username
            User user = userService.findByUsername(authRequest.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            // Validate password
            if (!userService.validatePassword(authRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            // Tạo Access Token và Refresh Token
            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getUsername(),
                    user.getAuthoritiesAsArray()
            );
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

            // Tạo response
            AuthResponse authResponse = AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(15 * 60L) // 15 minutes in seconds
                    .build();

            log.info("User {} logged in successfully", user.getUsername());
            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    /**
     * Endpoint refresh token
     * Nhận Refresh Token, trả về Access Token mới
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            // Validate refresh token
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid or expired refresh token");
            }

            // Kiểm tra có phải refresh token không
            if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token is not a refresh token");
            }

            // Lấy username từ token
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);

            // Load user để lấy authorities
            UserDetails userDetails = userService.loadUserByUsername(username);
            User user = userService.findByUsername(username);

            // Tạo Access Token mới
            String newAccessToken = jwtTokenProvider.generateAccessToken(
                    user.getUsername(),
                    user.getAuthoritiesAsArray()
            );

            // Tạo response
            AuthResponse authResponse = AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // Giữ nguyên refresh token
                    .tokenType("Bearer")
                    .expiresIn(15 * 60L) // 15 minutes in seconds
                    .build();

            log.info("Access token refreshed for user {}", username);
            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            log.error("Refresh token error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token failed: " + e.getMessage());
        }
    }

    /**
     * Endpoint để validate token
     * Kiểm tra token có hợp lệ không
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token từ header "Bearer <token>"
            String token = authHeader.replace("Bearer ", "");
            
            boolean isValid = jwtTokenProvider.validateToken(token);
            
            if (isValid) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                String[] authorities = jwtTokenProvider.getAuthoritiesFromToken(token);
                
                return ResponseEntity.ok(new TokenValidationResponse(
                        true,
                        "Token is valid",
                        username,
                        authorities
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new TokenValidationResponse(false, "Token is invalid", null, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse(false, "Error: " + e.getMessage(), null, null));
        }
    }

    // Inner class cho validation response
    private static class TokenValidationResponse {
        private boolean valid;
        private String message;
        private String username;
        private String[] authorities;

        public TokenValidationResponse(boolean valid, String message, String username, String[] authorities) {
            this.valid = valid;
            this.message = message;
            this.username = username;
            this.authorities = authorities;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public String getUsername() { return username; }
        public String[] getAuthorities() { return authorities; }
    }
}

