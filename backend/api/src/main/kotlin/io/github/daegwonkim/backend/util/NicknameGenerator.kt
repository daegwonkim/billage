package io.github.daegwonkim.backend.util

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.daegwonkim.backend.vo.NicknameWords
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

@Component
class NicknameGenerator {
    private val mapper = jacksonObjectMapper()
    private val words: NicknameWords

    init {
        val resource = ClassPathResource("data/nicknames.json")
        words = mapper.readValue(resource.inputStream)
    }

    fun generate(): String {
        val adj = words.adjectives.random()
        val noun = words.nouns.random()
        return "$adj $noun"
    }
}