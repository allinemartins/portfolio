package om.allinemartins.bookclub.bookclub_api.config.security;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class KeycloakRolesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final String clientId;

    public KeycloakRolesConverter(String clientId) {
        this.clientId = clientId;
    }

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        Object realmAccessObj = jwt.getClaims().get("realm_access");
        if (realmAccessObj instanceof Map<?, ?> realmAccess) {
            Object realmRolesObj = realmAccess.get("roles");
            roles.addAll(asStringList(realmRolesObj));
        }

        Object resourceAccessObj = jwt.getClaims().get("resource_access");
        if (resourceAccessObj instanceof Map<?, ?> resourceAccess) {
            Object clientObj = resourceAccess.get(clientId);
            if (clientObj instanceof Map<?, ?> clientMap) {
                Object clientRolesObj = clientMap.get("roles");
                roles.addAll(asStringList(clientRolesObj));
            }
        }

        return roles.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(s -> s.toUpperCase(Locale.ROOT))
                .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    private List<String> asStringList(Object rolesObj) {
        if (rolesObj instanceof List<?> list) {
            return list.stream().filter(Objects::nonNull).map(String::valueOf).toList();
        }
        return List.of();
    }
}
