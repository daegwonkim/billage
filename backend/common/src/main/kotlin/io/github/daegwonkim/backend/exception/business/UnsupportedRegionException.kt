package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.errorcode.NeighborhoodErrorCode

class UnsupportedRegionException(
    latitude: Double,
    longitude: Double
) : BusinessException(
    errorCode = NeighborhoodErrorCode.UNSUPPORTED_REGION,
    logMessage = "지원하지 않는 지역에 대한 요청 발생: latitude=$latitude, longitude=$longitude"
)