package io.github.daegwonkim.backend.enumerate.page;

public enum SortDirection {
    ASC,
    DESC;

    public static SortDirection fromString(String value) {
        if (value == null) {
            return DESC;
        }
        try {
            return SortDirection.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return DESC;
        }
    }
}
