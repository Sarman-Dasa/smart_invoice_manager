<?php

namespace App\Contracts;

use Generator;

interface AiGeneratorInterface
{
    /**
     * Generate a complete response string.
     *
     * @param string $prompt
     * @return string
     * @throws \App\Exceptions\AiGenerationException
     */
    public function generate(string $prompt): string;

    /**
     * Stream the response back in chunks using a Generator.
     *
     * @param string $prompt
     * @return Generator<string>
     * @throws \App\Exceptions\AiGenerationException
     */
    public function stream(string $prompt): Generator;
}
