package io.github.daegwonkim.backend.enumerate

enum class RentalItemCategory(
    val title: String,
    val iconPath: String,
    val order: Int,
) {
    HOUSEHOLD("가정용품", "/icons/household.svg", 0),
    TRAVEL("여행용품", "/icons/travel.svg", 1),
    FASHION("패션", "/icons/fashion.svg", 2),
    ELECTRONIC("전자기기", "/icons/electronic.svg", 3),
    SPORTS("스포츠/운동", "/icons/sports.svg", 4),
    CHILDCARE("육아/교육", "/icons/childcare.svg", 5)
}