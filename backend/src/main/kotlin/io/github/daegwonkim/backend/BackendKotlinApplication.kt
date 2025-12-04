package io.github.daegwonkim.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@EnableJpaAuditing
@SpringBootApplication
class BackendKotlinApplication

fun main(args: Array<String>) {
	runApplication<BackendKotlinApplication>(*args)
}
