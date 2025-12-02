package io.github.daegwonkim.backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
        log.warn("BusinessException: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(e.getErrorCode(), request.getRequestURI());

        return ResponseEntity
                .status(getHttpStatus(e.getErrorCode()))
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e, HttpServletRequest request) {
        log.warn("Validation failed: {}", e.getMessage());

        List<ErrorResponse.FieldError> fieldErrors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> new ErrorResponse.FieldError(
                        fieldError.getField(),
                        fieldError.getRejectedValue() != null ?
                                fieldError.getRejectedValue().toString() : "",
                        fieldError.getDefaultMessage()
                ))
                .toList();

        ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, request.getRequestURI(), fieldErrors);

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {
        log.error("Unexpected error occurred", e);

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    private HttpStatus getHttpStatus(ErrorCode errorCode) {
        int code = errorCode.getCode();

        if (code >= 2000 && code < 3000) {
            return HttpStatus.UNAUTHORIZED;
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
