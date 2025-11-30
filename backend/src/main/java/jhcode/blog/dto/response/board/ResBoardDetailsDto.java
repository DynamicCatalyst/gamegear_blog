package jhcode.blog.dto.response.board;

import jhcode.blog.entity.Board;
import jhcode.blog.dto.response.comment.ResCommentDto;
import jhcode.blog.dto.response.file.ResBoardDetailsFileDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;



@Getter
@Setter
@NoArgsConstructor
public class ResBoardDetailsDto {

    private Long boardId;
    private String title;
    private String content;
    private int viewCount;
    private String writerName;
    private String writerEmail;
    private String createdDate;
    private String modifiedDate;

    private List<ResCommentDto> comments;

    private List<ResBoardDetailsFileDto> files;

    @Builder
    public ResBoardDetailsDto(Long boardId, String title, String content, int viewCount, String writerName, String writerEmail, String createdDate, String modifiedDate, List<ResCommentDto> comments, List<ResBoardDetailsFileDto> files) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.writerName = writerName;
        this.writerEmail = writerEmail;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.comments = comments;
        this.files = files;
    }

    public static ResBoardDetailsDto fromEntity(Board board) {
        return ResBoardDetailsDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .viewCount(board.getViewCount())
                .writerName(board.getMember().getUsername())
                .writerEmail(board.getMember().getEmail())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .comments(board.getComments().stream()
                        .map(ResCommentDto::fromEntity)
                        .collect(Collectors.toList()))
                .files(board.getFiles().stream()
                        .map(ResBoardDetailsFileDto::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
