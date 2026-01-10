plugins {
    kotlin("plugin.jpa") version "2.2.21"
    id("dev.monosoul.jooq-docker") version "8.0.9"
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
    implementation("org.jooq:jooq:3.20.10")
    implementation("org.springframework.boot:spring-boot-starter-jooq") {
        exclude(group = "org.jooq", module = "jooq")
    }
    jooqCodegen("org.postgresql:postgresql")

    // geo
    implementation("org.locationtech.jts:jts-core:1.19.0")
    implementation("org.hibernate:hibernate-spatial:7.1.11.Final")

    testImplementation(kotlin("test"))
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-redis-test")

    testImplementation("org.testcontainers:junit-jupiter:1.20.1")
    testImplementation("org.testcontainers:postgresql:1.21.4")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

jooq {
    withContainer {
        image {
            name = "postgis/postgis:16-3.4"
            envVars = mapOf(
                "POSTGRES_PASSWORD" to "testPassword",
                "POSTGRES_DB" to "testDB",
                "POSTGRES_USER" to "testUser"
            )
        }
        db {
            username = "testUser"
            password = "testPassword"
            name = "testDB"
            port = 5432
            jdbc {
                schema = "jdbc:postgresql"
                driverClassName = "org.postgresql.Driver"
            }
        }
    }
}

tasks.register("copyMigrations") {
    doLast {
        val sourceDir = file("${rootProject.projectDir}/supabase/migrations")
        val targetDir = file("src/main/resources/db/migration")

        targetDir.deleteRecursively()
        targetDir.mkdirs()

        sourceDir.listFiles()
            ?.filter { it.extension == "sql" }
            ?.sortedBy { it.name }  // 타임스탬프순 정렬
            ?.forEachIndexed { index, file ->
                val name = file.name.substringAfter("_")  // init.sql
                val newName = "V${index + 1}__$name"
                file.copyTo(File(targetDir, newName))
            }
    }
}

tasks.generateJooqClasses {
    dependsOn("copyMigrations")

    schemas.set(listOf("public"))
    migrationLocations.setFromFilesystem("src/main/resources/db/migration")
    basePackageName.set("io.github.daegwonkim.backend.jooq")
    outputDirectory.set(project.layout.buildDirectory.dir("generated-src/jooq/main"))

    usingJavaConfig {
        generate.apply {
            isTables = true
            isRecords = false
            isPojos = false
            isImmutablePojos = false
            isDaos = false
            isDeprecated = false
            isFluentSetters = false
            isJavaTimeTypes = true
        }
        database.withExcludes("flyway_schema_history")
    }
}

// clean 시 복사된 마이그레이션도 삭제
tasks.clean {
    delete("src/main/resources/db/migration")
}