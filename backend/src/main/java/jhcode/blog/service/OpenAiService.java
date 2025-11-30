package jhcode.blog.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.ai.openai.OpenAiChatModel;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final OpenAiChatModel chatModel;

    public String suggest(String currentText) {
        if (!StringUtils.hasText(currentText)) {
            return "";
        }

        String prompt = "You are helping a user write a blog post. " +
                "Given the text below, continue it in a concise way (1-2 sentences max). " +
                "Return only the continuation, no explanations.\n\n" + currentText;

        return chatModel.call(prompt);
    }
}
