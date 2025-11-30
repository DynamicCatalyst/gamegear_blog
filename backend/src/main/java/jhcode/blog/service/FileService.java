package jhcode.blog.service;

import jakarta.transaction.Transactional;
import jhcode.blog.entity.Board;
import jhcode.blog.repository.BoardRepository;
import jhcode.blog.common.exception.ResourceNotFoundException;
import jhcode.blog.entity.FileEntity;
import jhcode.blog.repository.FileRepository;
import jhcode.blog.dto.response.file.ResFileDownloadDto;
import jhcode.blog.dto.response.file.ResFileUploadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final BoardRepository boardRepository;
    private final FileRepository fileRepository;

    @Value("${project.folderPath}")
    private String FOLDER_PATH;

    public List<ResFileUploadDto> upload(Long boardId, List<MultipartFile> multipartFiles) throws IOException {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new ResourceNotFoundException("Board", "Board Id", String.valueOf(boardId))
        );
        List<FileEntity> fileEntitys = new ArrayList<>();
        boolean savedOne = false;

        for (MultipartFile multipartFile : multipartFiles) {
            if (savedOne) {
                break;
            }

            String contentType = multipartFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                continue;
            }

            String fileName = multipartFile.getOriginalFilename();

            String randomId = UUID.randomUUID().toString();

            String filePath =
                    "POST_" + board.getId() + "_" + randomId.concat(fileName.substring(fileName.indexOf(".")));

            String fileResourcePath = FOLDER_PATH + File.separator + filePath;

            File f = new File(FOLDER_PATH);
            if (!f.exists()) {
                f.mkdir();
            }

            Files.copy(multipartFile.getInputStream(), Paths.get(fileResourcePath));

            FileEntity saveFile = FileEntity.builder()
                    .originFileName(multipartFile.getOriginalFilename())
                    .filePath(filePath)
                    .fileType(multipartFile.getContentType())
                    .build();
            saveFile.setMappingBoard(board);

            fileEntitys.add(fileRepository.save(saveFile));
            savedOne = true;
        }
        List<ResFileUploadDto> dtos = fileEntitys.stream()
                .map(ResFileUploadDto::fromEntity)
                .collect(Collectors.toList());

        return dtos;
    }

    public ResFileDownloadDto download(Long fileId) throws IOException {
        FileEntity file = fileRepository.findById(fileId).orElseThrow(
                () -> new FileNotFoundException()
        );
        String filePath = FOLDER_PATH + file.getFilePath();
        String contentType = determineContentType(file.getFileType());
        byte[] content = Files.readAllBytes(new File(filePath).toPath());
        return ResFileDownloadDto.fromFileResource(file, contentType, content);
    }

    public void delete(Long fileId) {
        FileEntity file = fileRepository.findById(fileId).orElseThrow(
                () -> new ResourceNotFoundException("File", "File Id", String.valueOf(fileId))
        );

        String filePath = FOLDER_PATH + File.separator + file.getFilePath();
        File physicalFile = new File(filePath);
        if (physicalFile.exists()) {
            physicalFile.delete();
        }
        fileRepository.delete(file);
    }

    private String determineContentType(String contentType) {
        switch (contentType) {
            case "image/png":
                return MediaType.IMAGE_PNG_VALUE;
            case "image/jpeg":
                return MediaType.IMAGE_JPEG_VALUE;
            case "text/plain":
                return MediaType.TEXT_PLAIN_VALUE;
            default:
                return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }
}
