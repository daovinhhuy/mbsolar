-- Re-runnable migration: allow each construction project to have many images.
-- Images are stored in the shared images table and can be reused.
BEGIN;

CREATE TABLE IF NOT EXISTS construction_project_images (
    project_id      BIGINT NOT NULL REFERENCES construction_projects(id) ON DELETE CASCADE,
    image_id        BIGINT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, image_id)
);

CREATE INDEX IF NOT EXISTS construction_project_images_image_idx
    ON construction_project_images (image_id, project_id);
CREATE UNIQUE INDEX IF NOT EXISTS construction_project_images_one_primary_idx
    ON construction_project_images (project_id) WHERE is_primary;

COMMIT;
