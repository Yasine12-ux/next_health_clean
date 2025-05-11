package com.healthcarepfe.appointments.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        servers = {
                @Server(
                        description = "Structure Service Local ENV",
                        url = "http://localhost:8070"
                )
        })

public class OpenApiConfig {
}
