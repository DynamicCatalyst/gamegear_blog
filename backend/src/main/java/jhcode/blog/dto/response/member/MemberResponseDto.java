package jhcode.blog.dto.response.member;

import jhcode.blog.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
public class MemberResponseDto {
    private String email;
    private String username;

    @Builder
    public MemberResponseDto(String email, String username) {
        this.email = email;
        this.username = username;
    }

    public static MemberResponseDto fromEntity(Member member) {
        return MemberResponseDto.builder()
                .email(member.getEmail())
                .username(member.getUsername())
                .build();
    }
}
