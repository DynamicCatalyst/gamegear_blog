package jhcode.blog.dto.response.comment;

import jhcode.blog.entity.Comment;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
public class ResCommentDto {

    private Long commentId;
    private String content;
    private String createdDate;
    private String modifiedDate;
    private String commentWriterName;
    private String userName;
    private String email;

    @Builder
    public ResCommentDto(Long commentId,
                         String content,
                         String createdDate,
                         String modifiedDate,
                         String commentWriterName,
                         String userName,
                         String email) {
        this.commentId = commentId;
        this.content = content;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.commentWriterName = commentWriterName;
        this.userName = userName;
        this.email = email;
    }


    public static ResCommentDto fromEntity(Comment comment) {
        return ResCommentDto.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .modifiedDate(comment.getModifiedDate())
                .commentWriterName(comment.getMember().getDisplayName())
                .userName(comment.getMember().getDisplayName())
                .email(comment.getMember().getUsername())
                .build();
    }
}
