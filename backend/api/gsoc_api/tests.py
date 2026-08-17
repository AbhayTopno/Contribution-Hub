from unittest.mock import Mock, patch

from django.test import SimpleTestCase, override_settings

from api.gsoc_api.management.commands.fetch_github_url import Command
from api.gsoc_api.utils import GitHubSearchError, search_github_organization


@override_settings(GITHUB_TOKEN="test-token")
class GitHubSearchTests(SimpleTestCase):
    @patch("api.gsoc_api.utils.requests.get")
    def test_returns_first_matching_organization_url(self, mock_get):
        response = Mock(ok=True)
        response.json.return_value = {"items": [{"html_url": "https://github.com/empa-scientific-it"}]}
        mock_get.return_value = response

        url = search_github_organization("Urban Energy Systems Laboratory, Empa")

        self.assertEqual(url, "https://github.com/empa-scientific-it")
        self.assertEqual(mock_get.call_args.kwargs["params"]["q"], "Urban Energy Systems Laboratory, Empa type:org")

    @patch("api.gsoc_api.management.commands.fetch_github_url.search_github_organization")
    @patch("api.gsoc_api.management.commands.fetch_github_url.time.sleep")
    def test_non_retryable_github_error_is_not_retried(self, mock_sleep, mock_search):
        mock_search.side_effect = GitHubSearchError(403, "Resource not accessible")

        with self.assertRaises(GitHubSearchError):
            Command()._search_github_url("3DTK GitHub")

        mock_search.assert_called_once_with("3DTK")
        mock_sleep.assert_not_called()

    @patch("api.gsoc_api.management.commands.fetch_github_url.search_github_organization")
    @patch("api.gsoc_api.management.commands.fetch_github_url.time.sleep")
    def test_rate_limited_search_waits_for_reset_then_retries(self, mock_sleep, mock_search):
        mock_search.side_effect = [
            GitHubSearchError(403, "API rate limit exceeded", retry_after_seconds=42),
            "https://github.com/3dtk",
        ]

        url = Command()._search_github_url("3DTK GitHub")

        self.assertEqual(url, "https://github.com/3dtk")
        self.assertEqual(mock_search.call_count, 2)
        mock_sleep.assert_called_once_with(42)
