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
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}