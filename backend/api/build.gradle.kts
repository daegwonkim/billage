group = "io.github.daegwonkim"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":infra"))

    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.postgresql:postgresql")

    // jsonwebtoken
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}

val moduleConfigs = listOf("domain", "infra")

val copyTasks = moduleConfigs.map { moduleName ->
    tasks.register<Copy>("copy${moduleName}Config") {
        from(project(":$moduleName").file("src/main/resources/application-${moduleName}.yml"))
        into(layout.buildDirectory.dir("resources/main"))
    }
}

tasks.processResources {
    dependsOn(copyTasks)
}