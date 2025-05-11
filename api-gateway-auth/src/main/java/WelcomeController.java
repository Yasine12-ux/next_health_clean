import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/welcome")
public class WelcomeController {
    @Operation(summary = "✅ : welcome message")
    @RequestMapping("/message")
        public String welcomeMessage() {
            return "Welcome to the API Gateway";
        }
}
