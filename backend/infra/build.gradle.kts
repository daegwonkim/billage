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
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    // coolsms
    implementation("net.nurigo:sdk:4.3.0")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}