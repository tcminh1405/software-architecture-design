package iuh.fit.se.jwt.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT Token Provider
 * Chịu trách nhiệm tạo và validate JWT tokens
 * Sử dụng HS256 algorithm với secret key để sign và verify tokens
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret:mySecretKey123456789012345678901234567890}")
    private String secret;

    // Thời gian sống của Access Token (15 phút)
    private static final long ACCESS_TOKEN_VALIDITY = 15 * 60 * 1000; // 15 minutes
    
    // Thời gian sống của Refresh Token (7 ngày)
    private static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000; // 7 days

    /**
     * Lấy secret key từ string
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Tạo Access Token từ username và authorities
     * Access Token có thời gian sống ngắn (15 phút)
     * Chứa thông tin về user và quyền truy cập
     */
    public String generateAccessToken(String username, String[] authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities", authorities);
        claims.put("type", "access");
        
        return createToken(claims, username, ACCESS_TOKEN_VALIDITY);
    }

    /**
     * Tạo Refresh Token từ username
     * Refresh Token có thời gian sống dài (7 ngày)
     * Dùng để lấy Access Token mới khi Access Token hết hạn
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        
        return createToken(claims, username, REFRESH_TOKEN_VALIDITY);
    }

    /**
     * Tạo JWT token với claims và thời gian sống
     * Sử dụng HS256 với secret key để sign token
     */
    private String createToken(Map<String, Object> claims, String subject, long validity) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + validity))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validate token và trả về username
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * Lấy expiration date từ token
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * Lấy claim cụ thể từ token
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Lấy tất cả claims từ token
     * Sử dụng secret key để verify token
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Kiểm tra token có hết hạn chưa
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Validate token
     * Kiểm tra token có hợp lệ không (chưa hết hạn và signature đúng)
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Validate token chỉ dựa trên token (không cần UserDetails)
     */
    public Boolean validateToken(String token) {
        try {
            getAllClaimsFromToken(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Kiểm tra token có phải là refresh token không
     */
    public Boolean isRefreshToken(String token) {
        try {
            String type = getClaimFromToken(token, claims -> claims.get("type", String.class));
            return "refresh".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Lấy authorities từ token
     */
    @SuppressWarnings("unchecked")
    public String[] getAuthoritiesFromToken(String token) {
        try {
            Object authorities = getClaimFromToken(token, claims -> claims.get("authorities"));
            if (authorities instanceof java.util.List) {
                return ((java.util.List<?>) authorities).toArray(new String[0]);
            } else if (authorities instanceof String[]) {
                return (String[]) authorities;
            }
            return new String[0];
        } catch (Exception e) {
            return new String[0];
        }
    }
}
