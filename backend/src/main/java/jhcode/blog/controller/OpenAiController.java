package jhcode.blog.controller;

import jhcode.blog.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class OpenAiController {

    private final OpenAiService openAiService;

    @PostMapping("/suggest")
    public ResponseEntity<String> suggest(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", "");
        String suggestion = openAiService.suggest(text);
        return ResponseEntity.ok(suggestion);
    }
}
