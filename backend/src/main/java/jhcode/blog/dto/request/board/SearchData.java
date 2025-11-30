package jhcode.blog.dto.request.board;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class SearchData {

    String title;
    String content;
    String writerName;

    @Builder
    public SearchData(String title, String content, String writerName) {
        this.title = title;
        this.content = content;
        this.writerName = writerName;
    }

    public static SearchData createdSearchData(String title, String content, String writerName) {
        return SearchData.builder()
                .title(title)
                .content(content)
                .writerName(writerName)
                .build();
    }
}
