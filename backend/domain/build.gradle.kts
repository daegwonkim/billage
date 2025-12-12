plugins {
    kotlin("plugin.jpa") version "2.2.21"
    id("nu.studer.jooq") version "9.0"
}

group = "io.github.daegwonkim"
version = "0.0.1-SNAPSHOT"

tasks.bootJar {
    enabled = false
}

tasks.jar {
    enabled = true
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.postgresql:postgresql")

    // jooq
    implementation("org.springframework.boot:spring-boot-starter-jooq")
    jooqGenerator("org.postgresql:postgresql:42.7.7")

    // geo
    implementation("org.locationtech.jts:jts-core:1.19.0")
    implementation("org.hibernate:hibernate-spatial:7.1.11.Final")

    testImplementation(kotlin("test"))
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-redis-test")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

noArg {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

jooq {
    version.set("3.19.28")

    configurations {
        create("main") {
            jooqConfiguration.apply {
                logging = org.jooq.meta.jaxb.Logging.WARN

                jdbc.apply {
                    driver = "org.postgresql.Driver"
                    url = "jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
                    user = "postgres.jeenwjbvzjvbpmpllepp"
                    password = "eornjs1449."
                }

                generator.apply {
                    name = "org.jooq.codegen.DefaultGenerator"

                    database.apply {
                        name = "org.jooq.meta.postgres.PostgresDatabase"
                        inputSchema = "public"
                    }

                    generate.apply {
                        isDeprecated = false
                        isRecords = true
                        isPojos = true
                        isFluentSetters = true
                    }

                    target.apply {
                        packageName = "io.github.daegwonkim.backend.jooq.generated"
                        directory = "src/main/generated/jooq"
                    }
                }
            }
        }
    }
}

sourceSets {
    main {
        java {
            srcDir("src/main/generated/jooq")
        }
    }
}