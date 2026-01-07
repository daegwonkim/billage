package io.github.daegwonkim.backend.event

import io.github.daegwonkim.backend.event.dto.StorageFileDeleteEvent
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class StorageEventListener(
    private val supabaseStorageClient: SupabaseStorageClient
) {

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun handleFileDelete(event: StorageFileDeleteEvent) {
        supabaseStorageClient.removeFile(event.bucket, event.fileKey)
    }
}