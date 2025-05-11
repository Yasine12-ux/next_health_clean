package com.healthcarepfe.ehr.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        servers = {
                @Server(
                        description = "Structure Service Local ENV",
                        url = "http://localhost:8060"
                )
        })

public class OpenApiConfig {
}
