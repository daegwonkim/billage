package io.github.daegwonkim.backend.common.config;

import io.github.daegwonkim.backend.enumerate.entity.RentalItemCategory;
import io.github.daegwonkim.backend.enumerate.page.SortBy;
import io.github.daegwonkim.backend.enumerate.page.SortDirection;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToSortByConverter());
        registry.addConverter(new StringToSortDirectionConverter());
        registry.addConverter(new StringToRentalItemCategoryConverter());
    }

    private static class StringToRentalItemCategoryConverter implements Converter<String, RentalItemCategory> {
        @Override
        public RentalItemCategory convert(String source) {
            return RentalItemCategory.fromString(source);
        }
    }

    private static class StringToSortByConverter implements Converter<String, SortBy> {
        @Override
        public SortBy convert(String source) {
            return SortBy.fromString(source);
        }
    }

    private static class StringToSortDirectionConverter implements Converter<String, SortDirection> {
        @Override
        public SortDirection convert(String source) {
            return SortDirection.fromString(source);
        }
    }
}
