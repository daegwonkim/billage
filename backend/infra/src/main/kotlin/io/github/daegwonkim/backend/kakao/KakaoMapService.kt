package io.github.daegwonkim.backend.kakao

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

@Component
class KakaoMapService(
    @Value($$"${kakao.api-key}")
    private val apiKey: String,
    @Value($$"${kakao.geocoding-url}")
    private val kakaoGeocodingUrl: String
) {
    val logger = KotlinLogging.logger { }

    private val restClient: RestClient = RestClient.builder()
        .baseUrl(kakaoGeocodingUrl)
        .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK $apiKey")
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build()

    fun coordToAddress(latitude: Double, longitude: Double): KakaoGeocodingCoordToAddressResponse? {
        return try {
            return restClient.get()
                .uri { uriBuilder ->
                    uriBuilder.path("/v2/local/geo/coord2regioncode.json")
                        .queryParam("x", longitude)
                        .queryParam("y", latitude)
                        .build()
                }
                .retrieve()
                .body(KakaoGeocodingCoordToAddressResponse::class.java)
        } catch (e: Exception) {
            logger.error(e) { "카카오 API 호출 실패" }
            null
        }
    }
}