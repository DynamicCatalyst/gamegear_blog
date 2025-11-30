package jhcode.blog.repository;

import jhcode.blog.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.id = :boardID")
    Optional<Board> findByIdWithMemberAndCommentsAndFiles(Long boardID);

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member")
    Page<Board> findAllWithMemberAndComments(Pageable pageable);

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.title LIKE %:title%")
    Page<Board> findAllTitleContaining(String title, Pageable pageable);

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.content LIKE %:content%")
    Page<Board> findAllContentContaining(String content, Pageable pageable);

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.member.username LIKE %:username%")
    Page<Board> findAllUsernameContaining(String username, Pageable pageable);
}
