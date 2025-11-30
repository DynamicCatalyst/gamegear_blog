package jhcode.blog.dto.response.board;

import jhcode.blog.entity.Board;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
public class ResBoardListDto {
    private Long boardId;
    private String title;
    private String content;
    private int viewCount;
    private String createdDate;
    private String modifiedDate;
    private String writerName;

    @Builder
    public ResBoardListDto(Long boardId, String title, String content, int viewCount, String createdDate, String modifiedDate, String writerName) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.writerName = writerName;
    }

    public static ResBoardListDto fromEntity(Board board) {
        return ResBoardListDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .viewCount(board.getViewCount())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .writerName(board.getMember().getUsername())
                .build();
    }
}
