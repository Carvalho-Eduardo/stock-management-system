
package com.stockflow.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Trata erros de validação dos dados recebidos pela API.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErroDeValidacao(
            MethodArgumentNotValidException exception) {

        List<String> mensagens = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> erro.getDefaultMessage())
                .distinct()
                .toList();

        return criarResposta(
                HttpStatus.BAD_REQUEST,
                "Erro de validação",
                mensagens
        );
    }

    // Trata erros HTTP lançados pelos Services.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> tratarErroHttp(
            ResponseStatusException exception) {

        HttpStatus status = HttpStatus.valueOf(
                exception.getStatusCode().value()
        );

        return criarResposta(
                status,
                status.getReasonPhrase(),
                List.of(exception.getReason() != null
                        ? exception.getReason()
                        : "Ocorreu um erro na requisição.")
        );
    }

    // Trata violações de integridade no banco de dados.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> tratarErroDeIntegridade(
            DataIntegrityViolationException exception) {

        return criarResposta(
                HttpStatus.CONFLICT,
                "Conflito de dados",
                List.of("Não foi possível salvar os dados. Verifique se já existe um registro com as mesmas informações.")
        );
    }

    // Centraliza a criação das respostas de erro.
    private ResponseEntity<Map<String, Object>> criarResposta(
            HttpStatus status,
            String erro,
            List<String> mensagens) {

        Map<String, Object> resposta = new HashMap<>();

        resposta.put("status", status.value());
        resposta.put("erro", erro);
        resposta.put("mensagens", mensagens);

        return ResponseEntity
                .status(status)
                .body(resposta);
    }
}
