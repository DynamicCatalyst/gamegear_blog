package jhcode.blog.common.exception;

public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    String resourceName;
    String fieldName;
    String fieldValue;

    
    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s is not found [%s : %s]", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
