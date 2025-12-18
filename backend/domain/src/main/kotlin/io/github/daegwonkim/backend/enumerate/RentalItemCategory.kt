package io.github.daegwonkim.backend.enumerate

enum class RentalItemCategory(
    val label: String
) {
    HOUSEHOLD("가정용품"),
    TRAVEL("여행용품"),
    SPORTS("스포츠/운동"),
    ELECTRONIC("전자기기"),
    FASHION("패션"),
    CHILDCARE("육아/교육")
}