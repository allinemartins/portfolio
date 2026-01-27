package om.allinemartins.bookclub.bookclub_api.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityHelper {

    private static final String USER_ID = "3cb2927e-3734-478b-be60-a54dcbfeb110"; // change for userId Testing
    private static final String DISPLAY_NAME = "Alline Martins"; // change for displayName Testing

    public static String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return USER_ID;

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt jwt) return jwt.getSubject();

        return USER_ID;
    }

    public static String currentUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return DISPLAY_NAME;

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt jwt) {
            String name = jwt.getClaimAsString("name");
            return name != null ? name : DISPLAY_NAME;
        }
        return DISPLAY_NAME;
    }

}
